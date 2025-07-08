FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD=root
ENV MYSQL_DATABASE=SayHi

COPY sayhi.mysql.sql /docker-entrypoint-initdb.d/
