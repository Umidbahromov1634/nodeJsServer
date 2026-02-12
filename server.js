import http from "http";



let idCounter = 3;

const students = [
  { id: 1, name: "Ali", age: 15 },
  { id: 2, name: "Laylo", age: 14 },
];


let totalRequests = 0;
let lastRequestTime = null;

const server = http.createServer((req, res) => {

  totalRequests++;
  lastRequestTime = new Date().toISOString();

  console.log(`[REQUEST] ${req.method} ${req.url}`);


  const studentsCount = students.length;



  if (req.url === "/students" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(students));
  } else if (req.url === "/stats" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });

    res.end(
      JSON.stringify({
        totalRequests,
        studentsCount,
        lastRequestTime,
      })
    );
  }


  else if (req.url === "/students" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const newStudent = JSON.parse(body);

        const student = {
          id: idCounter++,
          name: newStudent.name,
          age: newStudent.age,
        };

        students.push(student);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(student));
      } catch {
        res.writeHead(400);
        res.end("Invalid JSON");
      }
    });
  } else {
    res.writeHead(404);
    res.end("Route not found");
  }
});

server.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
