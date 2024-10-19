# Dockerfile.nginx
FROM nginx:latest


COPY ./nginx.conf /etc/nginx/nginx.conf

# create the certificates locally first with certbot
# COPY /path/to/certificates /etc/ssl/certs/  

EXPOSE 80
# EXPOSE 443