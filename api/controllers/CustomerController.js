module.exports = {
  dashboard: async (req, res) => {

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

    return res.view('pages/customer/dashboard', {
      layout: 'layouts/template',
      cart: cart
    });
  },
  orders: async (req, res) => {

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

    return res.view('pages/customer/orders', {
      layout: 'layouts/template',
      cart: cart
    });
  }
};

