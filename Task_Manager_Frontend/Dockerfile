# -------- Build Phase --------

# Start from the official Node.js 18 image to build the React app
FROM node:18 AS build

# Set the working directory inside the container to /app
WORKDIR /app

# Copy package.json and package-lock.json first for caching npm install
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of your frontend source code into the container
COPY . .

# Build the production-ready React app in /app/build
RUN npm run build

# -------- Serve Phase --------

# Use a minimal and secure Nginx image to serve the static build files
FROM nginx:stable-alpine

# Copy the React build artifacts from the build stage into Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Replace the default Nginx config with your custom config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 so the container can serve HTTP traffic
EXPOSE 80

# Start Nginx in the foreground so the container keeps running
CMD ["nginx", "-g", "daemon off;"]
