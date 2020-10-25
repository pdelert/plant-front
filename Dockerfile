FROM nginx:stable-alpine

COPY dist/ /etc/nginx/html
COPY nginx_conf/nginx.conf /etc/nginx/nginx.conf
#COPY certs/ /etc/ssl/certs/

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]