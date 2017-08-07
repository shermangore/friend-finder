let Friend = require("../data/friends.js")
let results = [];

// Create a small sample set so the first user has someone to match with
let Jane = new Friend("Jane Johnson", "https://raw.githubusercontent.com/acani/fake_profile_pictures/master/lib/fake_profile_pictures/photos/square_2369151434.jpg", [1, 3, 3, 4, 1, 2, 5, 4, 3, 1]); //27
let Jake = new Friend("Jake Johanssen", "https://raw.githubusercontent.com/acani/fake_profile_pictures/master/lib/fake_profile_pictures/photos/square_2890368131.jpg", [3, 5, 2, 3, 2, 3, 4, 4, 4, 1]); //31
let Jerry = new Friend("Jerry Jacobsen", "https://raw.githubusercontent.com/acani/fake_profile_pictures/master/lib/fake_profile_pictures/photos/square_3156504080.jpg", [1, 2, 3, 5, 2, 1, 4, 4, 3, 5]); //30
let Julia = new Friend("Julia Justice", "https://raw.githubusercontent.com/acani/fake_profile_pictures/master/lib/fake_profile_pictures/photos/square_3244887018.jpg", [4, 5, 4, 2, 2, 1, 2, 3, 4, 2]); //29
let Janet = new Friend("Janet Jenkins", "https://raw.githubusercontent.com/acani/fake_profile_pictures/master/lib/fake_profile_pictures/photos/square_3377864339.jpg", [1, 1, 4, 2, 5, 3, 5, 3, 5, 3]); //32
//https://raw.githubusercontent.com/acani/fake_profile_pictures/master/lib/fake_profile_pictures/photos/square_3679345595.jpg
results.push(Jane, Jake, Jerry, Julia, Janet);

module.exports = function (app) {
	// This will be used to handle incoming survey results. 
	app.post("/api/friends", function (req, res) {
		//create an object to hold the best-match-so-far
		let bestFriend = {
			name: "",
			score: 999,  // Set super high because the first one will always be lower than this number
			index: -1 // Set to -1 so that a lack of match does not automatically return the first person in the array of friends
		};

		// If there are scores in the submission, then proceed.
		if (req.body.scores.length > 0) {
			//Loop through the list of people
			for (let i = 0; i < results.length; i++) {
				// Declare a variable to hold the difference between the user's and the current person's scores
				// Set here so that it will reset with each new person
				let diff = 0;

				// Loop through the scores for the currently indexed person and compare them to the user's scores
				// Can use the same loop variable ("j") because the questions are always in the same order
				for (let j = 0; j < results[i].scores.length; j++) {
					diff += (parseInt(req.body.scores[j]) - parseInt(results[i].scores[j]));
				}

				// If the difference between the user's overall score and the currently indexed person's overall
				//  score is less than the stored "bestFriend" score, then replace bestFriend with currently indexed person
				if (Math.abs(diff) <= bestFriend.score) {
					bestFriend.name = results[i].name;
					bestFriend.score = Math.abs(diff);
					bestFriend.index = i; // Storing this in the object so that it is easier to retrieve that person's data later
				}
			}

			// Add the person to the "stored" person list for comparison against the next user
			results.push(req.body);

			// Return bestie info
			res.json(results[bestFriend.index]);
		}
	});

	app.get("/api/friends", function (req, res) {
		// This will be used to display a JSON of all possible friends.
		if (results.length > 0) {
			console.log(JSON.stringify(results));
		}
		else {
			console.log("No available friends (sounds like real life, huh?)");
		}

		// Push results to page
		res.json({ friends: results });
	});
}