import dogRoutes from './dogs.js';
import userRoutes from './user.js';
import appRoutes from './application.js';

const constructorMethod = (app) => {
    //I'm not sure if this is what we want or not  
    app.use('/', userRoutes);
    app.use('/dog', dogRoutes)
    app.use('/app', appRoutes)


    app.use('*', (req, res) => {
        res.status(404).json({error: 'Route Not Found'});
    });
};

export default constructorMethod;