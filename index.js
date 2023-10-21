const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const port = process.env.PORT || 5001;

const app = express();
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT:${port}`);
});

app.get("/", (req, res) => {
  res.send("Server is running......");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ozgkari.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});





async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // database and collection code goes here
    //const db = client.db("userDB");
    const productsCollection = client.db("brandShopDB").collection("products");
    const cartsCollection = client.db("brandShopDB").collection("carts");


    
    //Get All Products
    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    //Get A Single Product
    app.get("/products/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      console.log(result);
      res.send(result);
    });



    

    //Get A Single Product
    app.get("/products/:brandName", async (req, res) => {
      //const id = req.params.id;
      const brandName = req.params.brandName;
      console.log(brandName);
      const query = { brandName: brandName };
      const cursor = await productsCollection.find(query);
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    //Create A User
    app.post("/product", async (req, res) => {
      const product = req.body;
      console.log("-------------SERVER REQUEST DATA ----------------");
      console.log(product);

      const result = await productsCollection.insertOne(product);

      // display the results of your operation
      console.log(result);
      res.send(result);
    });

    //Delete A Product
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });

    //Update A Product
    app.put("/products/:id", async (req, res) => {
      console.log("UPDATE");
      const id = req.params.id;
      console.log(id);
      const product = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          ...product
          /* productName: product.productName,
          brandName: product.brandName,
          productImage: product.productImage,
          productType: product.productType,
          productPrice: product.productPrice,
          productRating: product.productRating,
          productDescription: product.productDescription, */
        },
      };

      console.log("Updated Product : ");
      console.log(updatedProduct);

      const result = await productsCollection.updateOne(
        query,
        updatedProduct,
        options
      );

      // display the results of your operation
      console.log(result);
      res.send(result);
    });



    
    app.get("/carts", async (req, res) => {
      const cursor = cartsCollection.find();
      const result = await cursor.toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const product = req.body;
      console.log("-------------SERVER REQUEST DATA ----------------");
      console.log(product);

      try {
        const result = await cartsCollection.insertOne(product);
        // display the results of your operation
        console.log(result);
        res.send(result);
      } catch (error) {
        console.error("Error : ", error);
      }
    });

    app.delete("/carts/product/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      console.log(result);
      res.send(result);

      /* try {
        const id = req.params.id;
        console.log(id);
        const query = { _id: new ObjectId(id) };
        const result = await cartsCollection.deleteOne(query);
        console.log(result);
        if (result.deletedCount === 1) {
          res.send("Successfully deleted");
        } else {
          res.send("No document found with the provided ID");
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
        res.status(500).send("Error deleting document");
      } */

      /* try {
        const id = req.params.id;
        console.log(id);
        const query = { _id: id };
        const result = await cartsCollection.deleteOne(query);
        console.log(result);
        if (result.deletedCount === 1) {
          res.json({ message: "Successfully deleted" });
        } else {
          res
            .status(404)
            .json({ message: "No document found with the provided ID" });
        }
      } catch (error) {
        console.error("Error deleting document: ", error);
        res.status(500).json({ message: "Error deleting document" });
      } */
    });



    /**
     * *************************************************
     */

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }


  /**
   * *************************************************
   */
}
run().catch(console.dir);



