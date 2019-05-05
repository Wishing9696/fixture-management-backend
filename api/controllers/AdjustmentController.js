/**
 * AdjustmentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getAdjustmentsByDate: async function (req, res) {
    try {
      let dy = req.query.dateymd;
      let result = await getadjbydate(dy)
      res.send(result)
    } catch (e) {
      res.status(400).send
    }
  },

  getFixtureList: async function (req, res) {
    try {
      let dy = req.query.dateymd;
      let adjs = await getadjbydate(dy)
      let fs = []
      for (let a of adjs) {
        for (let f of a.conductor_fixtures) {
          let isExist = false
          for (let i of fs) {
            if (f.id === i.id) {
              isExist = true
              i.number += f.number
              i.lines = i.lines.concat("," + a.line)
            }
          }
          if (isExist === false) {
            fs.push({
              id: f.id,
              name: f.name,
              number: f.number,
              type: f.type,
              lines: a.line
            })
          }
        }
      }
      res.send(fs)
    } catch (e) {
      res.status(400).send
    }
  },

  getDetailByDateAndFixtureName: async function (req, res) {
    let dy = req.query.dateymd
    let name = req.query.name

    let adjs = await getadjbydate(dy)

    let detail = []

    for (let a of adjs) {
      for (let f of a.conductor_fixtures) {
        if (f.name === name) {
          detail.push({
            "线体": a.line,           
            "实际使用情况": f.me_number,
            "计划使用情况": f.number,
          })
        }
      }
    }
    res.send(detail)
  }
};

async function getadjbydate(dy) {
  let result = await Adjustment.find({
    dateymd: dy
  })
  return result
}
