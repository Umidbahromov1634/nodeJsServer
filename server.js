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
    console.log("[GET /students] HANDLER START");

    setTimeout(() => {
      console.log("[GET /students] TIMEOUT CALLBACK");

      res.writeHead(200, {
        "Content-Type": "application/json",
      });

      res.end(
        JSON.stringify({
          students: students,
        })
      );
    }, 500);
  }


  else if (req.url === "/students" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const parsed = JSON.parse(body);

        const newStudent = {
          id: idCounter++,
          name: parsed.name,
          age: parsed.age,
        };

        students.push(newStudent);


        setImmediate(() => {
          console.log("[POST /students] AFTER PARSING BODY (setImmediate)");
        });

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(JSON.stringify(students));
      } catch {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            error: "Invalid JSON",
          })
        );
      }
    });
  }


  else if (req.method === "POST") {
    res.writeHead(405, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Method Not Allowed",
      })
    );
  }


  else if (req.url === "/stats" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        totalRequests,
        studentsCount,
        lastRequestTime,
      })
    );
  }


  else {
    res.writeHead(404, {
      "Content-Type": "application/json",
    });

    res.end(
      JSON.stringify({
        error: "Not Found",
      })
    );
  }
});

server.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
