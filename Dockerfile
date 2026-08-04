# Usa la imagen oficial de Nginx (versión ligera)
FROM nginx:alpine

# Hyperlift utiliza el puerto 8080
RUN sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf

# Copia todos los archivos de la aplicación al directorio público de Nginx
COPY . /usr/share/nginx/html/

# Expone el puerto requerido por Hyperlift
EXPOSE 8080

# Inicia Nginx
CMD ["nginx", "-g", "daemon off;"]
