# hum - [youtube demo](https://youtu.be/Q72qRC1Hz2I)

hum is a twitter-like social media app where users can post "hums" using 50 characters or less

the frontend of the app was written in typescript using React

styling was done with styled components, no style libraries used

the backend was written in Golang

database used was PostgreSQL

Redis was used for storing user sessions

AWS S3 bucket was used for image storage

the application is running in a docker container in an AWS EC2 instance

AWS Route53 was used for dns configuration with an AWS classic load balancer in front of the EC2 instance

