import { gql } from "@apollo/client";

export const TASK_DETAILS = gql`
  fragment TaskDetails on Task {
    title
    completed
    description
    root
    supertask
    scheduled
    schedule {
      category
      start
      end {
        active
        date
      }
      reset {
        date
        active
      }
    }
    tag
    id
  }
`
// User Credentials
export const LOGIN = gql`
    mutation Mutation($username: String!, $password: String!) {
        login(username: $username, password: $password) {
        value
        }
    }
`
export const SIGNUP = gql`
  mutation Mutation($username: String!, $password: String!, $name: String!, $email: String!) {
    createUser(username: $username, password: $password, name: $name, email: $email) {
      username
      id
    }
  }
`

// Queries
export const USER = gql`
    query Query {
        me {
            ongoing
            username
            name
            email
            id
            tags
        }
    }
`
export const ALL_ROOT_TASKS = gql`
query Query($tag: String) {
    allRootTasks(tag: $tag) {
      ...TaskDetails
      subtasks {
        id
        title
        description
        completed
      }
    }
  }

  ${TASK_DETAILS}
`
export const ALL_TAGS = gql`
  query Query {
    allTags {
      name
      color
      favorite
      id
    }
  }
`
export const GET_TASK_TREE = gql`
  query Query($id: ID) {
    taskTree(id: $id) {
      ...TaskDetails
      subtasks {
        ...TaskDetails
        subtasks {
          ...TaskDetails
          subtasks {
            ...TaskDetails
            subtasks {
              ...TaskDetails
              subtasks {
                ...TaskDetails
              }
            }
          }
        }
      }
    }
  }
  ${TASK_DETAILS}
`
export const ORPHAN_SAVED_TASKS = gql`
query Query {
  orphanSavedTasks {
    title
    id
    description
    completed
    supertask
    root
    scheduled
    schedule {
      category
      start
      reset {
        active
        date
      }
      end {
        active
        date
      }
    }
    tag
  }
}
`
export const DELETE_SAVED_TASK = gql`
  mutation Mutation($id: ID!) {
    deleteSavedTask(id: $id)
  }
`
export const MATERIALIZE_TASK = gql`
  mutation MaterializeTask($id: ID!) {
    materializeTask(id: $id) {
      id
      title
      description
      completed
      root
      scheduled
      schedule {
        reset {
          date
          active
        }
        end {
          date
          active
        }
        start
        category
      }
      tag
    }
  }
`
export const APPEND_TASK = gql`
  mutation AppendTask($savedTaskId: ID!, $taskId: ID!) {
    appendTask(savedTaskId: $savedTaskId, taskId: $taskId) {
      id
      title
      description
      root
    }
  }
`


// Mutations
// Tasks
export const NEW_TASK = gql`
    mutation Mutation($id:ID ,$title: String!, $scheduled: Boolean!, $root: Boolean, $supertask: [ID], $description: String, $tag: ID, $schedule: ScheduleInput!) {
        newTask(id:$id ,title: $title, scheduled: $scheduled, root: $root, supertask: $supertask, description: $description, tag: $tag, schedule: $schedule) {
          ...TaskDetails
        }
    }

  ${TASK_DETAILS}
`
export const EDIT_TASK = gql`
mutation Mutation($schedule: ScheduleInput, $id: ID!, $completed: Boolean, $title: String, $description: String, $scheduled: Boolean, $tag: ID) {
  updateTask(schedule: $schedule, id: $id, completed: $completed, title: $title, description: $description, scheduled: $scheduled, tag: $tag) {
      ...TaskDetails
    }
  }

  ${TASK_DETAILS}
`
export const DELETE_TASK = gql`
  mutation Mutation($id: ID!) {
    deleteTask(id: $id)
  }
`
export const ADD_ONGOING = gql`
  mutation Mutation($id: String!) {
    addOngoing(id: $id)
  }
`
export const REMOVE_ONGOING = gql`
  mutation Mutation($id: String!) {
    removeOngoing(id: $id)
  }
`

// Tags
export const CREATE_TAG = gql`
  mutation Mutation($name: String!, $color: String!, $favorite: Boolean) {
    createTag(name: $name, color: $color, favorite: $favorite) {
      name
      color
      id
      favorite
    }
  }
`
export const EDIT_TAG = gql`
  mutation Mutation($name: String, $color: String, $favorite: Boolean, $id: ID) {
    editTag(name: $name, color: $color, favorite: $favorite, id: $id) {
      name
      color
      favorite
      id
    }
  }
`
export const DELETE_TAG = gql`
  mutation Mutation($id: ID!) {
    deleteTag(id: $id)
  }
`

// Saved Task
export const SAVE_TASK = gql`
  mutation Mutation($id: ID!) {
    saveTask(id: $id) {
      id
    }
  }
`

