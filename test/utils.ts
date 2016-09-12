import * as Database from "../src/database";

export function createTaskDummy(userId?: string, name?: string, description?: string) {
  var user = {
    name: name || "dummy task",
    description: description || "I'm a dummy task!"
  };

  if (userId) {
    user["userId"] = userId;
  }

  return user;
}

export function createUserDummy(email?: string) {
  var user = {
    email: email || "dummy@mail.com",
    name: "Dummy Jones",
    password: "123123"
  };

  return user;
}

export function createMarkupDummy(userId?: string, name?: string, content?: string, postUrl?: string, partnerId?:string) {
  var markup = {
    name: name || "dummy markup",
    content: content || '<div><h1>This is a test</h1></div>',
    postUrl: postUrl || 'https://www.google.com',
    partnerId: partnerId || 'SomeId'
  };

  if (userId) {
    markup["userId"] = userId;
  }
  if(partnerId){
    markup["partnerId"] = partnerId;
  }
  return markup;
}

export function clearDatabase(database: Database.IDatabase, done: MochaDone) {
  var promiseUser = database.userModel.remove({});
  var promiseTask = database.taskModel.remove({});
  var promiseMarkup = database.markupModel.remove({});

  Promise.all([promiseUser, promiseTask, promiseMarkup]).then(() => {
    done();
  }).catch((error) => {
    console.log(error);
  });
}

export function createSeedTaskData(database: Database.IDatabase, done: MochaDone) {
  return database.userModel.create(createUserDummy())
    .then((user) => {
      return Promise.all([
        database.taskModel.create(createTaskDummy(user._id, "Task 1", "Some dummy data 1")),
        database.taskModel.create(createTaskDummy(user._id, "Task 2", "Some dummy data 2")),
        database.taskModel.create(createTaskDummy(user._id, "Task 3", "Some dummy data 3")),
      ]);
    }).then((task) => {
      done();
    }).catch((error) => {
      console.log(error);
    });
}

export function createSeedUserData(database: Database.IDatabase, done: MochaDone) {
  database.userModel.create(createUserDummy())
    .then((user) => {
      done();
    })
    .catch((error) => {
      console.log(error);
    });
}

export function createSeedMarkupData(database: Database.IDatabase, done: MochaDone) {
  return database.userModel.create(createUserDummy())
    .then((user) => {
      return Promise.all([
        database.markupModel.create(createMarkupDummy(user._id, "Markup 1", "<div><h1>This is a test 1</h1></div>","https://www.google.com","abc")),
        database.markupModel.create(createMarkupDummy(user._id, "Markup 2", "<div><h1>This is a test 2</h1></div>","https://www.google.com","abc")),
        database.markupModel.create(createMarkupDummy(user._id, "Markup 3", "<div><h1>This is a test 3</h1></div>","https://www.google.com","abc"))
      ]);
    }).then((task) => {
      done();
    }).catch((error) => {
      console.log(error);
    });
}
