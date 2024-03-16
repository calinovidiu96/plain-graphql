# Use an official Node.js runtime as a parent image
FROM node:20.9.0-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .


# Command to run the app
CMD ["npm", "start"]

# Expose the port your app runs on
EXPOSE 3000
