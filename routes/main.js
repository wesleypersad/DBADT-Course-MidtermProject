const { render } = require("ejs");

module.exports = function (app) {
    app.get("/", function (req, res) {
        res.render("index.ejs")
    });
    app.get("/datatype", async function (req, res) {
        //searching in the database
        //let word = ['%' + req.query.keyword + '%'];
        //let sqlquery = "SELECT * FROM foods WHERE fname LIKE ?";
        let sqlquery = "SELECT * FROM DataType";
        // execute sql query
        try {
            const result = await db.query(sqlquery);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            console.log('Calling datatype.ejs');
            res.render('datatype.ejs', { datatypes: result });
        } catch (err) {
            return console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.get("/ethnicity", async function (req, res) {
        try {
            //searching in the database
            let sqlquery = "SELECT * FROM Ethnicity";
            // execute sql query
            let result = await db.query(sqlquery);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('ethnicity.ejs', { ethnicity: result });
        } catch (err) {
            return console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.get("/food", async function (req, res) {
        try {
            //searching in the database
            let sqlquery = "SELECT * FROM Food";
            // execute sql query
            const result = await db.query(sqlquery);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            console.log(req.query.keyword);
            res.render('food.ejs', { food: result, search:'' });
        } catch (err) {
            console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.get("/nutrient", async function (req, res) {
        //searching in the database
        let sqlquery = "SELECT * FROM Nutrient";
        // execute sql query
        try {
            let result = await db.query(sqlquery);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('nutrient.ejs', { nutrient: result, search: '' });
        } catch (err) {
            return console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.get("/purchases", async function (req, res) {
        //searching in the database
        //let sqlquery = "SELECT * FROM Purchases LIMIT 20";
        // Reproduce original table from subqueries from 3 normalized tables
        let sqlquery = "SELECT ID, Survey_Year, \
        (SELECT Ethnicity FROM Ethnicity WHERE Purchases.Ethnicity=Ethnicity.ID) AS Ethnicity, \
        (SELECT Food FROM Food WHERE Purchases.Food=Food.ID) AS Food, \
        ew, ew2, mw, mw2, ewmw, \
        (0.5*ew/mw) AS Est_av_qty, \
        (ew2/(ew*ew)) AS calc1, \
        (ewmw/(ew*mw)) AS calc2, \
        (mw2/(mw*mw)) AS calc3, \
        ('Est_av_qty'*sqrt('calc1'+'calc2'+'calc3')) AS Standard_error, \
        ('Standard_error'*100/'Est_av_qty') AS Res_standard_error \
        FROM Purchases";
        // execute sql query
        try {
            let result = await db.query(sqlquery);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('purchases.ejs', { purchases: result, search: '' });
        } catch (err) {
            console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.get("/expenditures", async function (req, res) {
        //searching in the database
        //let sqlquery = "SELECT * FROM Expenditures LIMIT 20";
        // Reproduce original table from subqueries from 3 normalized tables
        let sqlquery = "SELECT ID, Survey_Year, \
        (SELECT Ethnicity FROM Ethnicity WHERE Expenditures.Ethnicity=Ethnicity.ID) AS Ethnicity, \
        (SELECT Food FROM Food WHERE Expenditures.Food=Food.ID) AS Food, \
        ew, ew2, mw, mw2, ewmw, \
        (0.5*ew/mw) AS Est_av_exp, \
        (ew2/(ew*ew)) AS calc1, \
        (ewmw/(ew*mw)) AS calc2, \
        (mw2/(mw*mw)) AS calc3, \
        ('Est_av_qty'*sqrt('calc1'+'calc2'+'calc3')) AS Standard_error, \
        ('Standard_error'*100/'Est_av_exp') AS Res_standard_error \
        FROM Expenditures";
        // execute sql query
        try {
            const result = await db.query(sqlquery);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('expenditures.ejs', { expenditures: result, search: '' });
        } catch (err) {
            return console.error("Error found"
            + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.get("/intakes", async function (req, res) {
        //searching in the database
        //let sqlquery = "SELECT * FROM Intakes LIMIT 20";
        // Reproduce original table from subqueries from 4 normalized tables
        let sqlquery = "SELECT ID, \
        (SELECT DataType FROM DataType WHERE Intakes.DataType=DataType.ID) AS DataType, Survey_Year, \
        (SELECT Ethnicity FROM Ethnicity WHERE Intakes.Ethnicity=Ethnicity.ID) AS Ethnicity, \
        (SELECT Nutrient FROM Nutrient WHERE Intakes.Nutrient=Nutrient.ID) AS Nutrient, \
        Estimate_of_daily_intake, Standard_error, Residual_Standard_Error \
        FROM Intakes";
        try {
            // execute sql query
            let result = await db.query(sqlquery);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('intakes.ejs', { intakes: result, search: '' });
        } catch (err) {
            console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.post("/food", async function (req, res) {
        //searching in the database
        let word = ['%' + req.body.keyword + '%'];
        let sqlquery = "SELECT * FROM Food WHERE Food LIKE ?";
        // execute sql query
        try {
            let result = await db.query(sqlquery, word);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            console.log(req.query.keyword);
            res.render('food.ejs', { food: result, search: word });
        } catch (err) {
            return console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.post("/nutrient", async function (req, res) {
        //searching in the database
        let word = ['%' + req.body.keyword + '%'];
        let sqlquery = "SELECT * FROM Nutrient WHERE Nutrient LIKE ?";
        // execute sql query
        try {
            let result = await db.query(sqlquery, word);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('nutrient.ejs', { nutrient: result, search: word });
        } catch (err) {
            console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.post("/intakes", async function (req, res) {
        try {
            //searching in the database
            //let sqlquery = "SELECT * FROM Intakes LIMIT 20";
            // Reproduce original table from subqueries from 4 normalized tables
            let word = ['%' + req.body.keyword + '%'];
            let sqlquery = "SELECT ID, \
            (SELECT DataType FROM DataType WHERE Intakes.DataType=DataType.ID) AS DataType, Survey_Year, \
            (SELECT Ethnicity FROM Ethnicity WHERE Intakes.Ethnicity=Ethnicity.ID) AS Ethnicity, \
            (SELECT Nutrient FROM Nutrient WHERE Intakes.Nutrient=Nutrient.ID) AS Nutrient, \
            Estimate_of_daily_intake, Standard_error, Residual_Standard_Error \
            FROM Intakes \
            HAVING Nutrient LIKE ?";
            // execute sql query
            let result = await db.query(sqlquery, word);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('intakes.ejs', { intakes: result, search: word });
        } catch (err) {
            return console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.post("/purchases", async function (req, res) {
        //searching in the database
        //let sqlquery = "SELECT * FROM Purchases LIMIT 20";
        // Reproduce original table from subqueries from 3 normalized tables
        let word = ['%' + req.body.keyword + '%'];
        let sqlquery = "SELECT ID, Survey_Year, \
        (SELECT Ethnicity FROM Ethnicity WHERE Purchases.Ethnicity=Ethnicity.ID) AS Ethnicity, \
        (SELECT Food FROM Food WHERE Purchases.Food=Food.ID) AS Food, \
        ew, ew2, mw, mw2, ewmw, \
        (0.5*ew/mw) AS Est_av_qty, \
        (ew2/(ew*ew)) AS calc1, \
        (ewmw/(ew*mw)) AS calc2, \
        (mw2/(mw*mw)) AS calc3, \
        ('Est_av_qty'*sqrt('calc1'+'calc2'+'calc3')) AS Standard_error, \
        ('Standard_error'*100/'Est_av_qty') AS Res_standard_error \
        FROM Purchases \
        HAVING Food LIKE ?";
        try {
            // execute sql query
            const result = await db.query(sqlquery, word);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('purchases.ejs', { purchases: result, search: word });
        } catch (err) {
            return console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
    app.post("/expenditures", async function (req, res) {
        //searching in the database
        //let sqlquery = "SELECT * FROM Expenditures LIMIT 20";
        // Reproduce original table from subqueries from 3 normalized tables
        let word = ['%' + req.body.keyword + '%'];
        let sqlquery = "SELECT ID, Survey_Year, \
        (SELECT Ethnicity FROM Ethnicity WHERE Expenditures.Ethnicity=Ethnicity.ID) AS Ethnicity, \
        (SELECT Food FROM Food WHERE Expenditures.Food=Food.ID) AS Food, \
        ew, ew2, mw, mw2, ewmw, \
        (0.5*ew/mw) AS Est_av_exp, \
        (ew2/(ew*ew)) AS calc1, \
        (ewmw/(ew*mw)) AS calc2, \
        (mw2/(mw*mw)) AS calc3, \
        ('Est_av_qty'*sqrt('calc1'+'calc2'+'calc3')) AS Standard_error, \
        ('Standard_error'*100/'Est_av_exp') AS Res_standard_error \
        FROM Expenditures \
        HAVING Food LIKE ?";
        try {
            // execute sql query
            const result = await db.query(sqlquery, word);
            // if no results found output a message
            if (result.length == 0) {
                console.log("No records found");
            }
            res.render('expenditures.ejs', { expenditures: result, search: word });
        } catch (err) {
            console.error("Error found"
                + req.query.keyword + "error: " + err.message);
            res.redirect("/");
        }
    });
}
