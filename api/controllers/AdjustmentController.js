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
       let result = await Adjustment.find({
        dateymd: dy
      })
      res.send(result)
    } catch (e) {
      res.status(400).send
    }
  }
};
