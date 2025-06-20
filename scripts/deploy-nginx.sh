#!/bin/bash
echo "Starting push to ECR..."

aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
aws configure set aws_secret_access_key $AWS_ACCESS_KEY_ID

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ID.dkr.ecr.$AWS_REGION.amazonaws.com

echo "building...."
docker buildx build --platform linux/amd64 -t nabs-nginx ./nginx
echo "built"

echo "tagging"
docker tag nabs-nginx:latest $AWS_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_ECR_REPO_NGINX:latest
echo "tagged"

echo "pushing"
docker push $AWS_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$AWS_ECR_REPO_NGINX:latest
echo "pushed nginx image to ECR..."