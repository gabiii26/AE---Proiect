const obj = {
    name: "Adrian",
    greet: function() {
        // console.log("Hello, " + this.name);
        console.log(`Hello, ${this.name}`);
    },
    greet2: () => {
        // can not access the name
        console.log("Hello, " + this.name);
    }
}

obj.name = "Mihai"

obj.greet = function() {
    console.log('My name is not Adrian')
}

obj.greet();