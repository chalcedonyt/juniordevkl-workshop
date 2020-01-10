const firestore = require('../db/firestore')

const Tasks = firestore.collection('tasks')

const sortTask = (a,b) => {
  const taskA = a.task.toLowerCase();
  const taskB = b.task.toLowerCase();
  return (taskA < taskB) ? -1 : (taskA > taskB) ? 1 : 0;
}

module.exports = {
  findAll: async (req, res) => {
    const snapshot = await Tasks.get()
    let tasks = []
    if (!snapshot.empty) {
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        tasks.push({
          _id: doc.id,
          ...data
        })
      });
    }
    res.render('index', { tasks, deployer: process.env.DEPLOYER || 'Local' })
  },

  create: async (req, res) => {
    const ref = await Tasks.doc().set(req.body)
    res.json(req.body)
  },

  findOne: async (req, res) => {
    const ref = await Tasks.doc(req.params.id).get()
    const task = {
      _id: ref.id,
      ...ref.data()
    }
    res.render('edit', task)
  },

  complete: async (req, res) => {
    const ref = Tasks.doc(req.params.id)
    await ref.update({ completed: true })
    res.json({})
  },

  deleteOne: async (req, res) => {
    const ref = Tasks.doc(req.params.id)
    await ref.delete()
    res.json({})
  },

  updateName: async (req, res) => {
    const ref = Tasks.doc(req.body._id)
    await ref.update({ task: req.body.task })
    res.json({
      _id: req.body._id,
      task: req.body.task
    })
  }
}

