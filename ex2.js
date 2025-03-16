function build_chess(max_lenght) {
  for (let i = 0; i < max_lenght - 1; i++) {
    i % 2 != 0 ? console.log(" # # #") : console.log("# # # ");
  }
}

build_chess(6);
