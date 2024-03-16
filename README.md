## 🌐 Overview

This is a GraphQL server based on Express that uses plain queries (no Apollo). As databes it uses MongoDB (and Mongoose for internal management).  
The main architecture is build around Product and Producer and it contains queries as:

-   createProducer (  
            name: String;  
            country: String;  
            region: String;  
    )

-   createProducts ([
            vintage: String;
            name: String;
            producerId: String
            color: String
            quantity: Number;
            format: String;
            price: Number;
            duty: String;
            availability: String;
            conditions?: String;
            imageUrl?: String;
    ])

-   updateProduct(  
            id: String;  
            vintage: String;  
            name: String;  
            color: String;  
            quantity: Number;  
            format: String;  
            price: Number;  
            duty: String;  
            availability: String;  
            conditions: String;  
            imageUrl: String;  
    )

-   deleteProducts([\_ids: string[]])

-   getProduct(id: string)

-   getProductsByProducerId(producerId: string)

## The app incorporates a feature allowing users to import .csv files.

### Functionality:

-   Check if the file is a CSV file
-   Write a local file in temporary system memory:
    -   Check file headers:  
        "Vintage",  
        "Product Name",  
        "Producer",  
        "Country",  
        "Region",  
        "Colour",  
        "Quantity",  
        "Format",  
        "Price (GBP)",  
        "Duty",  
        "Availability",  
        "Conditions",  
        "ImageUrl",
    -   Check if Vintage, Product Name, Producer are not empty values in CSV file
    -   Creates a unique key in form of:
        key = `${vintage}_${productName}_${producer}`;
    -   Filter the entire .csv file and save just first row with this key and skip the duplicates
    -   Write the stream in a temporary local file
-   (I chose to store the filtered information for possible future functionalities that may use it.)
-   Send mongoose requests in batches to create products
-   Await to finish all the processes and delets the temporary file

## 💡 Two ways of importing a file

In the `/graphql/resolvers/uploadDocuments` folder you will find two options of importing:

-   With relationship between Product and Producer  
    ⏰ This one is more time comsuming ⏰  

    For an organized relationship between Producers and Products
    use this approach:

    -   `importProducersInDb()` function will import all producers from the .csv file (by unique names)
    -   `importToDatabaseWithFilter()` function will import all products (with a producerId)

    For eficiency, the `importToDatabaseWithFilter()` function uses a Map
    that will store the found users with the `producerName` as KEY and `producer._id` as VALUE
    so it will take the Producer from the Map for next products with the same `producerName`.

-   Without relationship between Product and Producer  
    ⚡ This one is more time efficient ⚡

    For BULK import of Products without a relationship of producerId
    just with the producerName assinged, use the `importToDatabase()` function.

## 💻 Install with Docker

-   Open a terminal in the main folder
-   Run `docker build -t frw .  `

## 🚀 Run the Application

-   Run `docker run -p 3000:3000 frw:latest`

Send GraphQL queries / mutations to: http://localhost:3000/graphql for all normal queries  
Send GraphQl mutation to: http://localhost:3000/uploadFile for uploading .csv file

## Test it

(The app is already connected to a Mongo Compass Free database instance)
-   You can find a GraphQL_Postman_import folder that contains a JSON file
-   Import the file in Postman and you're ready to go
