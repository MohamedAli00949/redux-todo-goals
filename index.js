const generateId = () => {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// Liberary code
function createSTore (reduce) {
    // the store should have four parts
    // 1. The state
    // 2. Getting The State
    // 3. Listen to changes on the state
    // 4. update the state

    let state
    let listeners = []

    const getState = () => state

    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter((l) => l !== listener);
        }
    }

    const dispash = (action) => {
        state = reduce(state, action)
        listeners.forEach((listener) => listener())
    }

    return {
        getState,
        subscribe,
        dispash
    }
}


// App code

const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'

function addTodoAction (todo) {
    return {
        type: ADD_TODO,
        todo,
    }
}

function removeTodoAction (id) {
    return {
        type : REMOVE_TODO,
        id,
    }
}

function toggleTodoAction (id) {
    return {
        type : TOGGLE_TODO,
        id,
    }
}

function addGoalAction (goal) {
    return {
        type: ADD_GOAL,
        goal,
    }
}

function removeGoalAction (id) {
    return {
        type : ADD_GOAL,
        goal,
    }
}

function toDos (state = [], action) {
    if (action.type === ADD_TODO) {
        return state.concat([action.todo])
    }else if (action.type === REMOVE_TODO) {
        return state.filter((todo) => todo.id !== action.id)
    }else if (action.type === TOGGLE_TODO) {
        return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete }))
    }else {
        return state
    }
}

function goals (state = [], action) {
    switch (action.type) {
        case ADD_GOAL : 
            return state.concat([action.goal])
        case REMOVE_GOAL : 
            return state.filter((goal) => goal.id !== action.id)
        default : 
            return state
    }
}

function app (state = {}, action) {
    return {
        todos: toDos(state.todos, action),
        goals: goals(state.goals, action)
    }
}

const store = createSTore(toDos, goals);

store.subscribe(() => {
    const { goals, todos } = store.getState()

    goals.forEach(addGoalToDOM)
    todos.forEach(addTodoToDOM)
});

// store.dispash(addTodoAction ({
//     id: 0,
//     name: 'Learn Redux',
//     complete: false,
// }))

// store.dispatch(addTodoAction({
//     id: 1,
//     name: 'Wash the car',
//     complete: false,
// }))

// store.dispatch(addTodoAction({
//     id: 2,
//     name: 'Go to the gym',
//     complete: true,
// }))

// store.dispatch(removeTodoAction(1))

// store.dispatch(toggleTodoAction(0))

// store.dispatch(addGoalAction({
//     id: 1,
//     name: 'Lose 20 pounds'
// }))

// store.dispatch(removeGoalAction(0))

// DOM Code
const addTodo = () => {
    const input = document.getElementById('todo')
    const name = input.value 
    input.value = ''

    store.dispash(addTodoAction({
        name,
        id: generateId(),
        complete: false,
        
    }))

}

document.querySelector("#todoButton").addEventListener("click", addTodo)


const addGoal = () => {
    const input = document.getElementById('goal')
    const name = input.value 
    input.value = ''

    store.dispash(addGoalAction({
        name,
        id: generateId(),
    }))
}


document.querySelector("#goalButton").addEventListener("click", addGoal)

const addTodoToDOM = (todo) => {
    const node = document.createElement('li')
    const text = document.createTextNode(todo.name)
    node.appendChild(text)

    document.getElementById('todo-list').appendChild(node)
}

const addGoalToDOM = (goal) => {
    const node = document.createElement('li')
    const text = document.createTextNode(goal.name)
    node.appendChild(text)

    document.getElementById('goals-list').append(node)
}
