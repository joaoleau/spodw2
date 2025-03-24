function build_pyramid(max_lenght) {
  let char = "X";
  for (let i = 0; i < max_lenght - 1; i++) {
    console.log(char);
    char += "X";
  }
}

build_pyramid(5);
