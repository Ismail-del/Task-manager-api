require('../src/db/mongoose');

const Tasks = require('../src/models/task');

// Tasks.findByIdAndDelete('5f94325decbbc884401f8451').then((task) => {
//     console.log(task);
//    return Tasks.countDocuments({ completed:true })
// }).then((result) => {
//     console.log(result)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTasksAndCount = async (id, completed) =>{

    await Tasks.findByIdAndDelete(id);
    const count = await Tasks.countDocuments( {completed} );
    return count;
}
deleteTasksAndCount('5f94c3c984f4ae9910dbfbc5', true).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})