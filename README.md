# hum

hum is a twitter-like social media app where users can post "hums" using 50 characters or less

the frontend of the app was written in typescript using React

styling was done with styled components, no style libraries used

the backend was written in Golang

database used was PostgreSQL

redis was used for storing user sessions

AWS S3 bucket was used for image storage

the application is running in a docker container in an aws ec2 instance
aws route53 was used for dns configuration with an aws classic load balancer in front of the ec2 instance

[hum.com](https://www.thehumapp.com/)
