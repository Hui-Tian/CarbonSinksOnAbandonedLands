var x = 5;

function hello() {
  return 5;
}

const hello2 = () => {
  return 5;
};

const hello3 = function () {
  return 5;
};

for (let i = 0; i < 100; i++) {
  console.log(i);
}

const indicies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (const i of indicies) {
  console.log(i);
}

indicies.forEach((i) => {
  console.log(i);
});
