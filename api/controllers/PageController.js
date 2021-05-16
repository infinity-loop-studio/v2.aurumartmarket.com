module.exports = {
  getPage: async (req, res) => {
    let currencies = await sails.helpers.getCurrencies();

    if (!req.session.currency) {
      var defaultCurrency = {
        symbol: '$',
        value: currencies.USD
      };
    } else {
      /* GET USER CURRENCY FROM SESSION */
    }

    let page = req.param('page'); /* GET PAGE NAME FROM URL */

    /* ADITIONAL VARIABLES*/
    let lessons = null;
    let courses = null;
    let cartScript = undefined;

    /* INIT CART*/
    let cart = {
      lessons: false,
      courses: false
    };

    /* LOOK AT COOKIES FOR PRODUCTS IN CART */
    if (req.cookies.cart) {
      if (req.cookies.cart.lessons.length) {
        var cartLessons = await Lessons.find({
          where: {
            id: req.cookies.cart.lessons
          }
        });
        cart.lessons = cartLessons;
      }
      if (req.cookies.cart.courses.length) {
        var cartCourses = await Courses.find({
          where: {
            id: req.cookies.cart.courses
          }
        });
        cart.courses = cartCourses;
      }
    }

    /* FETCH HOME PAGE */
    if (!page) {
      page = 'homepage';
    }

    /* FETCH LESSONS PAGE */
    if (page === 'lessons') {
      lessons = await Lessons.find();
      for (let i = 0; i < lessons.length; i++) {
        lessons[i].price = (Number(lessons[i].price) * currencies.USD) / defaultCurrency.value + defaultCurrency.symbol;
      }
    }

    /* FETCH COURSES PAGE */
    if (page === 'courses') {
      courses = await Courses.find();
      for (let i = 0; i < courses.length; i++) {
        courses[i].price = (Number(courses[i].price) * currencies.USD) / defaultCurrency.value + defaultCurrency.symbol;
      }
    }

    /* FETCH CART PAGE */
    if (page === 'cart') {
      cartScript = true;
    }

    return res.view('templates/il_aurum_art_market/pages/' + page, {
      layout: 'templates/il_aurum_art_market/index',
      cart: cart,
      defaultCurrency: defaultCurrency,
      lessons: lessons,
      courses: courses,
      cartScript: cartScript
    });
  },
  getLesson: async (req, res) => {
    let cart = {
      lessons: false,
      courses: false
    };
    let inCart = false;

    let lesson = await Lessons.findOne({
      systemName: req.param('product')
    });

    if (req.cookies.cart) {
      if (req.cookies.cart.lessons.length) {
        var cartLessons = await Lessons.find({
          where: {
            id: req.cookies.cart.lessons
          }
        });
        cart.lessons = cartLessons;
      }
      if (req.cookies.cart.courses.length) {
        var cartCourses = await Courses.find({
          where: {
            id: req.cookies.cart.courses
          }
        });
        cart.courses = cartCourses;
      }
    }

    if (req.cookies.cart) {
      for (let id of req.cookies.cart.lessons.values()) {
        if (lesson.id === Number(id)) {
          inCart = true;
        }
      }
    }

    return res.view('templates/il_aurum_art_market/pages/lesson', {
      layout: 'templates/il_aurum_art_market/index',
      lesson: lesson,
      addToCart: true,
      inCart: inCart,
      cart: cart
    });

  },
  getCourse: async (req, res) => {
    let cart = {
      lessons: false,
      courses: false
    };
    let inCart = false;

    let course = await Courses.findOne({
      systemName: req.param('product')
    });

    if (req.cookies.cart) {
      if (req.cookies.cart.lessons.length) {
        var cartLessons = await Lessons.find({
          where: {
            id: req.cookies.cart.lessons
          }
        });
        cart.lessons = cartLessons;
      }
      if (req.cookies.cart.courses.length) {
        var cartCourses = await Courses.find({
          where: {
            id: req.cookies.cart.courses
          }
        });
        cart.courses = cartCourses;
      }
    }

    if (req.cookies.cart) {
      for (let id of req.cookies.cart.courses.values()) {
        if (course.id === Number(id)) {
          inCart = true;
        }
      }
    }

    return res.view('pages/course', {
      layout: 'templates/il_aurum_art_market/index',
      course: course,
      addToCart: true,
      inCart: inCart,
      cart: cart
    });

  },
};

