# Use an official Node.js image for React
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port that the app will run on
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]