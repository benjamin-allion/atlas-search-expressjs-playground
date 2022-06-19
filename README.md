# Atlas Search Playground
Simple search webapp using "ExpressJS" & "MongoClient" for testing Atlas Search

That project contains a script to add some customer generated data into a MongoDB collection, \
Some script to create different indexes for testing, \
And a UI to select an index, try sample requests and se e results. 

# Setting up
- Clone the repo
- Launch ```npm install```
- Replace ```mongoUri.js``` variable by your mongo uri.
 
# To add sample customers data
To add some sample data into MongoDB :
- Launch ```npm run feedDatabase```

Note that script will add ```30000``` customers to your database (into ```test``` collection) for each execution. \
You can update the ```NUMBER_OF_CUSTOMERS_TO_GENERATE``` constant from ```feedDatabase.js``` if you want to add more or less.

# Add new extra customer fields
If you want to add some extra fields to each customer data to play with it,\
You look at ```feedDatabase.js``` and ```generateFakeCustomerData.js``` files.

There are one function for each ```identity```, ```address```, ```phoneNumber```, ```email``` object that you can change to add your custom fields.

# Run the UI
To run the UI webapp :
- Launch ```npm run start```
