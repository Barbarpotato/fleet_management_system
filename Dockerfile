# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma client and apply migrations
# This ensures the Prisma client is available and the database schema is up-to-date
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
# npm start will typically run `node index.js` as defined in package.json
CMD [ "npm", "start" ]
