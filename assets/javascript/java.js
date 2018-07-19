 // Initialize Firebase
 var config = {
    apiKey: "AIzaSyD-wIKb5adM02klhMtIerTdmMQSeaHgJHg",
    authDomain: "train-schedule-36370.firebaseapp.com",
    databaseURL: "https://train-schedule-36370.firebaseio.com",
    projectId: "train-schedule-36370",
    storageBucket: "train-schedule-36370.appspot.com",
    messagingSenderId: "105001007961"
  };
  firebase.initializeApp(config);

  // Sets firebase database
	var database = firebase.database();
  
  // Global Variables
	var trainName= "";
	var destination= ""
	var firstTrain="";
	var frequency = "";
	var nextTrain = null;
	var firstTimeConverted =null;
	var tMinutesTillTrain = null;
	
  // OnClick for form
  $("#submit").on("click", function(){
  //prevent default
  event.preventDefault();  
  
  // Get input from user & store in variables
  trainName = $("#trainName").val().trim();
  destination =  $("#destination").val().trim();
  firstTrain =  $("#firstTrain").val().trim();
  frequency =  $("#frequency").val().trim();
  
  console.log("Train Name: " +trainName);
  console.log("Destination: " +destination);
  console.log("First Train: " +firstTrain);
  console.log("Train Frequency: " +frequency);
  
  // Creates variables to connect to firebase
  var trainInfo = {
	  trainName: trainName,
	  destination: destination,
	  firstTrain: firstTrain,
	  frequency: frequency
	};

  // Pushes trainInfo to database
  database.ref().push(trainInfo);
  

  clearForm()
  
  });
  
  function clearForm() {
	  document.getElementById("trainForm").reset();
  };
  
  database.ref().on("child_added", function(childSnapshot) {
	  console.log(childSnapshot.val());
	
	  // Store everything into a variable.
	  trainName = childSnapshot.val().trainName;
	  destination = childSnapshot.val().destination;
	  firstTrain = childSnapshot.val().firstTrain;
	  frequency = childSnapshot.val().frequency; 
	
	  // Train Info
	  console.log(trainName);
	  console.log(destination);
	  console.log(firstTrain);
	  console.log(frequency);
	  
	  // First Time (pushed back 1 year to make sure it comes before current time)
	  firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
	  console.log(firstTimeConverted);
  
	  // Current Time
	  var currentTime = moment();
	  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
	  // Difference between the times
	  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
	  console.log("DIFFERENCE IN TIME: " + diffTime);
  
	  // Time remaining
	  var tRemainder = diffTime % frequency;
	  console.log(tRemainder);
  
	  // Minutes Until Train
	  tMinutesTillTrain = frequency - tRemainder;
	  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
  
	  // Next Train
	  nextTrain = moment().add(tMinutesTillTrain, "minutes");
	  console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
	 
		// Creates the new row
	  var newRow = $("<tr>").append(
		$("<td>").text(trainName),
		$("<td>").text(destination),
		$("<td>").text(frequency),
		$("<td>").text(nextTrain),
		$("<td>").text(tMinutesTillTrain)
	   
	  );
	
	  // Append the new row to the table
	  $("#mainSchedule > tbody").append(newRow);
	  
	});
	
	function displayTime () {
	  var currentTime = moment().format('MMM Do YYYY, h:mm:ss a');
	  $("#currentTime").text(currentTime);
  
	}
	setInterval(displayTime, 1000);
  