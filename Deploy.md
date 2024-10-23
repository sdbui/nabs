# Deploying

Originally built to be deployed on AWS ECS. After getting it working and noticing the couple bucks it would cost to maintain outside of the 1 year free tier, I've decided to move to Vercel which makes deployment dead simple.

Will still leave the notes for ECS here anyway...

## Build
Ensure AWS ECR Repo exists before attempting to push into it.

`npm run awspush`

In a nutshell, this authenticates to aws cli, builds a docker image, tags and pushes to ECR. The rest will be handled on via AWS Console

### ECS

- Create an ECS Cluster using the EC2 infrastucture.
- Create a Task Definition
  - launch type: **EC2 instance**
  - OS: **Linux/X86_64**
  - Network Mode: **bridge**
  - CPU 1vCPU
  - Memory: 0.5GB
  - Give it a name and use the uri of image created earlier. Can find it in the Elastic container registry.
  - Add port mappings
  - Add any environment variables here as well
- If desired, can use the following task definition JSON for reference:
  <details>
    <summary>Sample task definition json</summary>

    ```json
  {
      "family": "nabs-task-family",
      "containerDefinitions": [
          {
              "name": "nabsContainer",
              "image": "<aws-id>.dkr.ecr.<region>.amazonaws.com/nabs",
              "cpu": 1024,
              "portMappings": [
                  {
                      "name": "nabscontainer-80-tcp",
                      "containerPort": 80,
                      "hostPort": 80,
                      "protocol": "tcp",
                      "appProtocol": "http"
                  },
                  {
                      "name": "nabscontainer-3000-tcp",
                      "containerPort": 3000,
                      "hostPort": 3000,
                      "protocol": "tcp",
                      "appProtocol": "http"
                  }
              ],
              "essential": true,
              "environment": [],
              "mountPoints": [],
              "volumesFrom": [],
              "logConfiguration": {
                  "logDriver": "awslogs",
                  "options": {
                      "awslogs-group": "/ecs/nabs-task-family",
                      "mode": "non-blocking",
                      "awslogs-create-group": "true",
                      "max-buffer-size": "25m",
                      "awslogs-region": "us-west-1",
                      "awslogs-stream-prefix": "ecs"
                  }
              },
              "healthCheck": {
                  "command": [
                      "CMD-SHELL",
                      "wget -q --spider http://localhost:3000/ || exit 1"
                  ],
                  "interval": 30,
                  "timeout": 5,
                  "retries": 5,
                  "startPeriod": 60
              },
              "systemControls": []
          }
      ],
      "volumes": [],
      "placementConstraints": [],
      "requiresCompatibilities": [
          "EC2"
      ],
      "cpu": "1024",
      "memory": "512",
      "runtimePlatform": {
          "cpuArchitecture": "X86_64",
          "operatingSystemFamily": "LINUX"
      }
  }
    ```
  </details>

- Navigate back to the cluster and start the task or create a new service with the task definition we just created.

## HTTPS
- Valid domain name required that points to the EC2 instance
- SSH into EC2 instance 
- Install and run certbot and follow instructions. Certs will be found in `/etc/letsencrypt/live/{domain}`. It may be necessary to change file/folder permissions.
- When sym linking these certs into the directory used in Docker image (`/etc/ssl/certs) they did not seem to work. Instead, I manually created the files and copy pasted. Works but makes automating certificate renewal a bit more complicated.
- The Nginx container will proxy requests to the main application container so make sure whatever name that container will have is in the proxy pass directive.
- See this task definition for inspiration 
<details>
  <summary>nextjs-nginx-json</summary>

  ```json
{
    "taskDefinitionArn": "arn:aws:ecs:us-west-1:<aws id>:task-definition/nabs-nextjs-nginx:6",
    "containerDefinitions": [
        {
            "name": "nabsapp",  
            "image": "<aws-id>.dkr.ecr.us-west-1.amazonaws.com/nabs",
            "cpu": 0,
            "portMappings": [
                {
                    "name": "app-port-3000",
                    "containerPort": 3000,
                    "hostPort": 3000,
                    "protocol": "tcp",
                    "appProtocol": "http"
                }
            ],
            "essential": true,
            "environment": [
                {
                    "name": "HOST",
                    "value": "http://yourdomain"
                },
                {
                    "name": "NEXTAUTH_URL",
                    "value": "http://yourdomain"
                }
            ],
            "mountPoints": [],
            "volumesFrom": [],
            "hostname": "nabsapp",
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/nabs-nextjs-nginx",
                    "mode": "non-blocking",
                    "awslogs-create-group": "true",
                    "max-buffer-size": "25m",
                    "awslogs-region": "us-west-1",
                    "awslogs-stream-prefix": "ecs"
                },
                "secretOptions": []
            },
            "healthCheck": {
                "command": [
                    "CMD-SHELL",
                    "wget -q --spider http://localhost:3000/ || exit 1"
                ],
                "interval": 30,
                "timeout": 5,
                "retries": 3
            },
            "systemControls": []
        },
        {
            "name": "nabsnginx",
            "image": "<awsid>.dkr.ecr.us-west-1.amazonaws.com/nabs-nginx:latest",
            "cpu": 0,
            "links": [
                "nabsapp:nginxToNabs"
            ],
            "portMappings": [
                {
                    "name": "80-80",
                    "containerPort": 80,
                    "hostPort": 80,
                    "protocol": "tcp"
                },
                {
                    "name": "ssl",
                    "containerPort": 443,
                    "hostPort": 443,
                    "protocol": "tcp"
                }
            ],
            "essential": false,
            "environment": [],
            "mountPoints": [
                {
                    "sourceVolume": "certs-volume",
                    "containerPath": "/etc/ssl/certs"
                }
            ],
            "volumesFrom": [],
            "dependsOn": [
                {
                    "containerName": "nabsapp",
                    "condition": "HEALTHY"
                }
            ],
            "systemControls": []
        }
    ],
    "family": "nabs-nextjs-nginx",
    "taskRoleArn": "arn:aws:iam::<awsid>:role/ecsTaskExecutionRole",
    "executionRoleArn": "arn:aws:iam::<awsid>:role/ecsTaskExecutionRole",
    "networkMode": "bridge",
    "revision": 6,
    "volumes": [
        {
            "name": "certs-volume",
            "host": {
                "sourcePath": "/etc/ssl/certs"
            }
        }
    ],
    "status": "ACTIVE",
    "requiresAttributes": [
        {
            "name": "ecs.capability.execution-role-awslogs"
        },
        {
            "name": "com.amazonaws.ecs.capability.ecr-auth"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.17"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.28"
        },
        {
            "name": "com.amazonaws.ecs.capability.task-iam-role"
        },
        {
            "name": "ecs.capability.container-health-check"
        },
        {
            "name": "ecs.capability.execution-role-ecr-pull"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.29"
        },
        {
            "name": "com.amazonaws.ecs.capability.logging-driver.awslogs"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.24"
        },
        {
            "name": "com.amazonaws.ecs.capability.docker-remote-api.1.19"
        },
        {
            "name": "ecs.capability.container-ordering"
        }
    ],
    "placementConstraints": [],
    "compatibilities": [
        "EC2"
    ],
    "requiresCompatibilities": [
        "EC2"
    ],
    "cpu": "1024",
    "memory": "512",
    "runtimePlatform": {
        "cpuArchitecture": "X86_64",
        "operatingSystemFamily": "LINUX"
    },
    "registeredAt": "2024-10-20T05:26:55.616Z",
    "registeredBy": "arn:aws:iam::<awsid>:root",
    "tags": []
}
  ```
</details>
  
- Key notes from above:
  - make sure the container name given for the main app is the same as in the nginx.conf file
  - Network mode should be bridge. In awspvc mode, the containers can talk via localhost but doing this gave me issues with being able to connect to my MongoDB Atlas.
  - Set a link to app from the nginx container. (this is apparently deprecated but could not figure how else to get the main app host to resolve from docker container)
  - Add a health check to main app container and as a dependency for nginx container to start