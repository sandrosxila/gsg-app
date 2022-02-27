import express from 'express';
import cors from 'cors';
import AuthRouter from './routes/auth';
import UserRouter from './routes/users';
import ProductRouter from './routes/products';
import connectDB from './utils/connectDB';

(async function () {

    await connectDB();
    const app = express();
    const port = 5000;

    app.use(cors());
    app.use(express.json());

    app.use("/auth", AuthRouter);
    app.use("/users", UserRouter);
    app.use("/products", ProductRouter);

    app.listen(port, () => {
        console.log('Connected to port: ' + port);
    });

})();