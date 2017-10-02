
title = Architecture of The Website
time = 2017-9-27
author = Linghaol


//////


### Overview

This article introduces the website architecture thoroughly with hands-on practice, which will cover the followings:

- dependency and component
- organizing principle
- service

In short, what it relies on, how it runs, what it provides.<br>


//////


### Dependency and Component

The website is built on a Python framework - [Flask](http://flask.pocoo.org/), which provides an "engine" with basic functions for web applications and flexibility to append many other wheels if needed. In Flask app, a HTML template can be controlled and customized by Flask, which is similar to a raw model, you can put what you want to show in it and return it to end users. The blogpage template in my website only has a skeleton with no content. Whenever a request comes, blog files stored locally will be loaded and added to blogpage template. As for blog update, all I need to do is writing blogs in Markdown, updating local blog files by running *update.py*, done!<br>
(Some intermediate processes involve parsing blogs and transforming Markdown files to HTML files by *Blogparser.py*)<br>
<br>
To deploy the website, a HTTP server is necessary. Thanks to a good guide of [deployment](https://www.fullstackpython.com/deployment.html) from fullstackpython.com and a comprehensive tutorial [talk video](https://www.youtube.com/watch?v=vGphzPLemZE) from PyCon2017 by Andrew Baker, I knew about [Gunicorn](http://gunicorn.org/) server and its default proxy server NGINX. It shouldn't be difficult to finish installation, configuration and getting it work, but things became a little bit tricky when I expected to containerize all of them together in Docker.<br>
<br>
[Docker](https://www.docker.com/), container is fascinating! Imagine that you can run many services centralizedly on one server or distributedly on many workers, these services are stored in different light-weight boxes, which are relatively isolated to each other. Easy to build, to run, to stop, to rebuild......Everything seems to be easier when containerized. However, due to its design, configuration can sometimes be confusing. I didn't remember how much time was used in finding solutions to issues, especially for those rookies like me with less knowledge about its art.(Some of its documents are somehow not that elegant like Docker itself.) Thus, I really hope the experience I obtained can be helpful for you guys in using Docker.<br>
<br>
Overall, currently there are 3 running containers, NGINX container, website body container with Gunicorn, VPN container with password update, and 1 volume for data sharing (mainly password for VPN now).<br>
All codes are avaible on my Github page and Docker official image Github page.

- [NGINX-1.13.5-mainline-alpine](https://github.com/nginxinc/docker-nginx/tree/1d2e2ccae2f6e478f628f4091d8a5c36a122a157/mainline/alpine)
- [Website and VPN](https://github.com/linghaol/linghaol.com)

I will explain how to build and use this containers below.<br>
<br>
Words end, graph and code time!<br>

### Organizing Principle

I drew a diagram to show the relations.<br>
<br>
![Architecture Diagram](../static/image/architecture-diagram.png)<br>
<br>
As you can see, the whole site and its future development will based on Docker container system. To implement these containers, you need to have a physical server or a cloud instance, like AWS EC2. I created an instance with Ubuntu 14.04 on AWS. Then you need to install Docker CE for Ubuntu by following the [instruction](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/). Note that you only need to finish those codes before *"Install from a package"*. After that, you can continue.<br>
<br>
Get instance public IP or DNS, then log in using ssh.(I use Ubuntu VM. Also make sure you have uploaded your public key to AWS and allowed ssh traffic port 22 in security groups inbound.)<br>

```
ssh -i <private key path> ubuntu@<ip or DNS>
git clone https://github.com/linghaol/linghaol.com.git
cd ./linghaol.com
```

These steps above help you connect your instance, clone folder from my repository and enter the folder. There is an order to run the containers, otherwise issues will come out because of prerequisites.<br>

```
cd ./volume_container
sudo docker build -t linghaol/volume .
sudo docker run -v mydata:/shared_data linghaol/volume
```

These steps build a container and bind its directory "/shared_data" to a volume called "mydata". Actually this container is only used to create a volume and add files to it(See Dockerfile), which means you can definitely do it by hands and copy files to your volume. Running a container instead is more convenient. Don't worry about this container, after it complets the job, it will stop. You can remove it if you want. The volume is persistent, and that is an important reason to use it for data sharing.<br>
<br>
Since a volume has been created, you can run the following website container, NGINX container and VPN container.<br>
Website container:<br>

```
cd ../
sudo docker build -t linghaol/website .
sudo docker run -d -v mydata:/shared_data --name website linghaol/website
```

A container called "website" has been created to run the website, but it cannot be visited by outside networks yet. The reason is that you only expose container port 8000, but don't bind the container port to any host port (Port 8000 is reserved for NGINX in Gunicorn). Thus, it can only be reached within Docker system. The next thing you need to do is to check the website's "Docker ip address". Docker has a route mechanism, which will assign a internal ip to every running container(Usually 172.17.0.2 is for the first running container, you had better check it out for sure and modify NGINX configuration.)<br>

```
sudo docker exec -it website bash
hostname -i
exit
```

Now you already have the internal ip address for website container. You need to modify *proxy_pass* variable in *nginx.vh.default.conf* by any editor you like and then save.(I like vim.) After that, you can run NGINX container.<br>
NGINX container:

```
cd ./nginx_container
sudo docker build -t linghaol/nginx .
sudo docker run -d -p 80:80 --name nginx linghaol/nginx
```

You run a container for NGINX, expose container port 80 and bind host port 80 (port for HTTP!) to its container port 80. Every request from host port 80 will be passed to NGINX and then passed to website container.<br>
Finally, VPN container:

```
cd ../vpn_container
sudo docker build -t linghaol/vpn .
sudo docker run -d -v mydata:/shared_data -p 8388:8388 --name vpn linghaol/vpn
```

VPN container does't need to pass NGINX, so you bind host port 8388 to its container port 8388.<br>
<br>
You are done now! Every one can visit the website by ip address or domain name (if you have) as long as you modify the inbound rules in security groups for you instance on aws to allow HTTP (port 80) traffic.<br>

### Service
For now, VPN is the only avalible service. I promise this is the first one, but not the last one. Part of the logic has been shown in architecture diagram. Here I drew another flowchart to show the process of password authorization. It is so clear that I don't need to make any explanation.<br>
<br>
![Password Authorization Diagram](../static/image/password_authorization.png)<br>
<br>
Alright, guys!<br>
This is pretty much all I want to talk about.<br>
Many thanks for your reading.<br>
Hope you enjoy the time on my website! ^_^<br>
<br>