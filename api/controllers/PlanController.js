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
            number: ff.number,
            type: f[0].type
          })
        }
        plansaddfixture.push({
          id: pitem.id,
          name: product[0].name,
          startdate: pitem.startdate,
          enddate: pitem.enddate,
          startdateymd: handledate(pitem.startdate),
          enddateymd: handledate(pitem.enddate),
          fixtures: fs
        })
      }
      for (let paf of plansaddfixture) {
        for (let f of paf.fixtures) {
          let i = 0
          for (let c of cs) {
            if (f.id === c.id) {
              i++
              c.number += f.number
            }
          }
          if (i == 0) {
            let data = {}
            Object.assign(data, f)
            cs.push(data)
          }
        }
      }
      let result = {
        line: plans[0].line,
        date: date,
        dateymd: handledate(date),
        plans: plansaddfixture,
        count: cs
      }
      res.send(result)
    } catch (e) {
      res.status(400).send
    }
  },
};

function handledate(d) {
  let dd = new Date(parseInt(d));
  let year = dd.getFullYear();
  let month = dd.getMonth() + 1;
  let day = dd.getDate();
  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;
  return year + '-' + month + '-' + day;
}
