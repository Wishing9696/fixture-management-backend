/**
 * PlanController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getPlansByDate: async function (req, res) {
    try {
      let date = req.query.date;
      let result = await Plan.find({
        startdate: {
          '<=': date
        },
        enddate: {
          '>=': date
        }
      })

      res.send(result)

    } catch (e) {
      res.status(400).send
    }
  },

  getPlansDetailsByIds: async function (req, res) {
    try {
      let date = req.query.date
      let pis = req.body
      let plans = []
      let cs = []
      let plansaddfixture = []
      let fs = []
      for (let pi of pis) {
        let p = await Plan.find({
          id: pi.id
        })
        plans.push(p[0]) //返回为Array对象，取第‘0’个
      }
      for (let pitem of plans) {
        let product = await Product.find({
          pn: pitem.pn
        })
        fs = []
        for (let ff of product[0].fixtures) { //返回为Array对象，取第‘0’个
          let f = await Fixture.find({
            id: ff.id
          })
          fs.push({
            id: f[0].id,
            name: f[0].name,
            number: ff.number
          })
        }

        plansaddfixture.push({
          id: pitem.id,
          name: product[0].name,
          startdate: pitem.startdate,
          enddate: pitem.enddate,
          fixtures: fs
        })
      }
      console.log(plansaddfixture)
      for (let paf of plansaddfixture) {
        console.log(paf)
        for (f of paf.fixtures) {
          console.log(f)
          for (let c of cs) {
            console.log(c)
            if (f.id === c.id) {
              c.number += f.number
            } else {
              c.push(f)
            }
          }
        }
      }
      console.log(c)

      let result = {
        line: ps[0].line,
        date: date,
        plans: plansaddfixture,
        count: c
      }
      res.send(result)
    } catch (e) {
      res.status(400).send
    }
  }
};


async function handleall(planids) {
  for (let id in planids) {
    let plans = await Plan.find({
      id: id
    })
    /**
     * return text like：
     * [
     *  {
     *    id:"",
     *    pn:"",
     *    line:"",
     *    startdate:"",
     *    enddate:""
     *  },{.......}
     * ]
     */
    for (let p in plans) {
      let pt = findProductBypn(p.pn)
    }
  }
}

async function findFixtureByid(id) {
  let f = await Fixture.find({
    id: id
  })
  return f
}
async function findProductBypn(pn) {
  /**
   * return text like；
   * [{
   *    id:"",
   *    pn:"",
   *    name:"",
   *    fixxtrues:[
   *      {
   *        id:"",
   *        number:""
   *      },{......}
   *    ]
   *  }，{......}
   * ]
   */
  let p = await Product.find({
    pn: pn
  })
}
