import homepageRoutes from './homepage.js';
import dogsRoutes from './dogs.js';
import appRoutes from './application.js';
import myDogsRoutes from './myDogs.js';
import quizRoutes from './quiz.js';
import settingsRoutes from './settings.js';

const constructorMethod = (app) => { 
    app.use('/', homepageRoutes);
    app.use('/dogs', dogsRoutes);
    app.use('/account', settingsRoutes);
    app.use('/account', quizRoutes);
    app.use('/account', myDogsRoutes);
    app.use('/account/application', appRoutes);

    app.use('*', (req, res) => {
        res.redirect('/');
    });
};

export default constructorMethod;