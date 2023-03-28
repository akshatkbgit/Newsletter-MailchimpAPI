//Requiring mailchimp's module
//For this we need to install the npm module @mailchimp/mailchimp_marketing. To do that we write:
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));


//Sending the signup.html file to the browser as soon as a request is made on localhost:3000
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
 
});
//Setting up MailChimp
mailchimp.setConfig({
    apiKey: "7384cf604ca90ebcd711cdf4eb360fa9-us17",
    server: "us17"
});
//As soon as the sign in button is pressed execute this
app.post("/", function (req,res) {
//*****************************CHANGE THIS ACCORDING TO THE VALUES YOU HAVE ENTERED IN THE INPUT ATTRIBUTE IN HTML******************************
    const firstName = req.body.firstName;
    const secondName = req.body.lastName;
    const email = req.body.email;
    //*****************************ENTER YOU LIST ID HERE******************************
    const listId = "7176e18781";
    //Creating an object with the users data
    const subscribingUser = {
        firstName: firstName,
        lastName: secondName,
        email: email
    };
    //Uploading the data to the server
    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
        //If all goes well logging the contact's id
        res.sendFile(__dirname + "/success.html")
        console.log(
            `Successfully added contact as an audience member. The contact's id is ${response.id}.`
        );
    }
//Running the function and catching the errors (if any)
// ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LECTURE*************************
// So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
    run().catch(e => {
        console.log(e);
        res.sendFile(__dirname + "/failure.html")
    });
});
app.post("/failure", function (req, res) {
        res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running at port 3000");
});

// API Key : 7384cf604ca90ebcd711cdf4eb360fa9-us17