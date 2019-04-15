
title = Architecture of The Website v1.1
label = blog2
date = Updated on Apr 15, 2019
author = ../static/image/me.jpg


//////


### Overview

This article introduces the website architecture thoroughly with hands-on practice, which covers the followings:

- Dependency
- New Architecture v1.1 and Deployment
- Service

In short, what it relies on, how it works, what it provides.<br>


//////


### Dependency

The website is built on a Python framework - [Flask](http://flask.pocoo.org/), which provides an "engine" with basic functions for web applications and flexibility to append many other wheels if needed. In Flask app, a HTML template can be controlled and customized by Flask, which is similar to a raw model, you can fill in with content and return it to end users. For example, the blogpage template in my website only has a skeleton. Whenever a request comes, bloglist.json will be loaded and added to blogpage template.<br>
<br>
As for updation, corresponding scripts are provided in utils folder. After modifying blogs or notes, simply run the script in the container(e.g., "python update_blogs.py blog1 blog3"), then it will take care of all things.<br>
(Some intermediate steps involving parsing blogs and transforming Markdown to HTML are included in Tools package.)<br>
*New in v1.1*<br>
<br>
To deploy the website, a HTTP server is necessary. Thanks to a good guide of [deployment](https://www.fullstackpython.com/deployment.html) from fullstackpython.com and a comprehensive tutorial [talk video](https://www.youtube.com/watch?v=vGphzPLemZE) from PyCon2017 by Andrew Baker, I knew about [Gunicorn](http://gunicorn.org/) server and its default proxy server NGINX. It shouldn't be difficult to finish installation, configuration and getting it work, but things messed up when I containerized all of them in Docker system.<br>
<br>
[Docker](https://www.docker.com/), container is fascinating! Imagine that you could run many services centralizedly on one server or distributedly on many workers, these services are stored in different light-weight boxes, which are relatively isolated to each other. Easy to build, to run, to stop, to rebuild......Everything seems to be easier when containerized. However, due to its design, configuration can sometimes be confusing. I didn't remember how much time was wasted in finding solutions to issues, especially for those rookies like me with less knowledge about its art.(Some of its documents are somehow not that elegant like Docker itself.) Therefore, I really hope the tricks I found could give you guys some help in using Docker.<br>
<br>
Overall, currently there are 4 containers for NGINX, website application, VPN and redis database. They are connected to a customized docker network with unique ip address.<br>
All code is available on [my Github repository](https://github.com/linghaol/linghaol.com).<br>
<br>
I will show how to build the application with graph and code below!<br>
<br>

### New Architecture v1.1 and Deployment

The whole new architecture diagram v1.1 comes! The older, coarser one could be found in repository.<br>
<br>
![Architecture Diagram v1.1](../static/image/architecture-diagram-v1.1.png)<br>
*New in v1.1*<br>
<br>
As you can see, the whole site and its future development are based on Docker container system. To implement these containers, you need to have a physical server or cloud instance(e.g., AWS EC2 instance). I created my instance with Ubuntu 14.04 on AWS. Then you need to install Docker CE for Ubuntu by following the [instruction](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/). Note: Only run those code before "Install from a package". After that, you can move on.<br>
<br>
Get instance public IP or DNS, then login with ssh.(Don't forget to upload public key to your AWS account and allow ssh traffic port 22 in security group inbound rules first!)<br>

```
ssh -i <private key path> ubuntu@<ip or DNS>
git clone https://github.com/linghaol/linghaol.com.git
cd ./linghaol.com
```

Steps above help you connect to your instance and clone files from my repository. Then follow the prerequisite order to build the network and run each container step by step.<br>
<br>
```
sudo docker network create --driver=bridge --subnet=100.0.0.0/8 mynet
```
First of all, a docker network is needed to keep containers connected. Here I created one called "mynet", specified bridge mode and subnet 100.0.0.0/8.<br>
*New in v1.1*<br>

```
cd ./redis
run pull_redis_image
sudo docker run -d --name redis --network mynet --ip 100.0.0.2 redis
```

Previously a docker volume was used to store data, but it was substituted by redis db in v1.1, which makes data transfer easier and more flexible. Pull a redis image from docker hub, then run the container and bind it to mynet with ip 100.0.0.2.<br>
*New in v1.1*<br>

```
cd ../website
sudo docker build -t linghaol/website .
sudo docker run -d --name website --network mynet --ip 100.0.0.3 linghaol/website
sudo docker exec -it website bash
python utils/update_blogs.py
python utils/update_notes.py
exit
```

A container called "website" has been created to run the website, but it's not accessible from external network. The reason is that container port 8000 is exposed, but not binded to any host port (Port 8000 is reserved for NGINX in Gunicorn). Also, you must enter this container and run 2 scripts to generate blogs and notes, because in building step, we haven't assigned ip address to it, update_notes.py is not able to access redis db and leads to an error.<br>

```
cd ../nginx
sudo docker build -t linghaol/nginx .
sudo docker run -d -p 80:80 --name nginx --network mynet --ip 100.0.0.4 linghaol/nginx
```

The next one is Nginx container. It is binded to host port 80 for http requests. Configuration file has been modified to pass requests to 100.0.0.3:8000(website container). The website is linked to the world!<br>

```
cd ../vpn
sudo docker build -t linghaol/vpn .
sudo docker run -d -p 8388:8388 --name vpn --network mynet --ip 100.0.0.5 linghaol/vpn
sudo docker exec -it vpn bash
python update_userlist.py
exit
```

VPN container is directly binded to host port 8388. Similar to website container, update_userlist.py must connect to redis db, so you have to run it once in the container. Every time you modify userlist.txt, don't forget to run this script again. It will synchronize redis db.<br>
<br>
You are done now! Every one can visit the website by ip address or domain name (if you have) as long as you modify the inbound rules in security groups for you instance on aws to allow HTTP (port 80) traffic.<br>

### Service
For now, VPN is the only avalible service. Password authorization logic is shown in the flowchart below. It should be clear enough for understanding.<br>
<br>
![Password Authorization Diagram](../static/image/password_authorization.png)<br>
<br>
It has been so long since this blog was posted on Sep 27, 2017 last time. v1.1 is mainly about redesigned architecture, sort of new look and a PyNotes page. I am aware that I almost did nothing. Many ideas actually appeared in my head, but many of them were rejected before birth. It is hard to satisfy others, and even harder to satisfy myself. Anyway, the site is for tech and fun, nothing else.<br>
<br>
Have fun!<br>