module.exports = {
  index: async (req, res) => {
    return res.view('administrator/templates/il_dashboard/pages/dashboard', {
      layout: 'administrator/templates/il_dashboard/index'
    });
  }
};

