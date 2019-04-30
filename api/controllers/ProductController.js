/**
 * ProductController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getConfigById: async function (req, res) {
    try {
      let id = req.query.id
      let r = await Product.find({
        id: id
      })
      let fs = []
      for (let f of r[0].fixtures) { //返回为Array对象，取第‘0’个
        let fr = await Fixture.find({
          id: f.id
        })
        fs.push({
          id: f.id,
          name: fr[0].name,
          number: f.number,
          a_amount: fr[0].a_amount
        })
      }
      let result = [{
        id: r[0].id,
        pn: r[0].pn,
        name: r[0].name,
        fixtures: fs
      }]
      res.send(result)
    } catch {
      res.status(400).send
    }
  },

  getProductByPlanIdentfier: async function (req, res) {
    try {
      let planid = req.query.planid
      let result = []
      let product = await Product.find({
        or: [{
            name: planid
          },
          {
            pn: planid
          }
        ]
      })
      for (let f of product[0].fixtures) {
        let ff = await Fixture.find({
          id: f.id
        })
        result.push({
          name: ff[0].name,
          number: f.number,
          type: ff[0].type
        })
      }
      res.send(result)
    } catch {
      res.status(400).send
    }
  }

};
