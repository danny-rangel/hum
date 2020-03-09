# Start from the latest golang base image
FROM golang:latest as builder

LABEL maintainer="Daniel Rangel hello@danielrangel.io"

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .


# Build the React application
FROM node:alpine AS node_builder
COPY --from=builder /app/frontend ./
RUN npm install
RUN npm run build

######## Start a new stage from scratch #######
FROM alpine:latest  

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the Pre-built binary file from the previous stage
COPY --from=builder /app/main .
COPY --from=node_builder /build ./client

EXPOSE 8080

CMD ["./main"] 