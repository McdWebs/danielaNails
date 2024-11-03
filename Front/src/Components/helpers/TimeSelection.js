import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import styles from "../../styles/style.module.css";
import { getUsers } from "../../api/user";
import HorizontalTimePicker from "./HorizontalTimePicker";

const TimeSelection = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [occupiedTimes, setOccupiedTimes] = useState([]);
  const [dailyAvailableTimes, setDailyAvailableTimes] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOccupiedTimes = async () => {
      try {
        const usersResponse = await getUsers();
        const users = usersResponse.data || [];

        const confirmedTimes = users
          .filter((user) => user.status === "confirmed" && user.time)
          .map((user) => `${user.time}`);
        setOccupiedTimes(confirmedTimes);
      } catch (error) {
        console.error("Error fetching user times:", error);
      }
    };

    const generateDailyAvailableTimes = () => {
      const dailyTimes = {};
      const startHour = 9;
      const endHour = 17;

      for (let day = 0; day < 7; day++) {
        const date = dayjs().add(day, "day").startOf("day");
        const formattedDate = date.format("MMMM D, YYYY");

        dailyTimes[formattedDate] = [];
        for (let hour = startHour; hour < endHour; hour++) {
          for (let minute = 0; minute < 60; minute += 30) {
            const time = date.hour(hour).minute(minute);
            const formattedDateTime = `${formattedDate} at ${time.format(
              "H:mm"
            )}`;

            if (!occupiedTimes.includes(formattedDateTime)) {
              dailyTimes[formattedDate].push(time);
            }
          }
        }

        if (dailyTimes[formattedDate].length === 0) {
          dailyTimes[formattedDate] = ["No available times"];
        }
      }
      setDailyAvailableTimes(dailyTimes);
    };

    fetchOccupiedTimes();
    generateDailyAvailableTimes();
  }, [occupiedTimes]); // Add occupiedTimes as a dependency

  const handleDateChange = (newValue) => {
    setSelectedDate(newValue);
    setSelectedTime(null);
    setErrorMessage("");
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirm = () => {
    const formattedDateTime =
      selectedDate && selectedTime
        ? `${selectedDate.format("MMMM D, YYYY")} at ${selectedTime.format(
            "H:mm"
          )}`
        : "";
    navigate("/contact", { state: { time: formattedDateTime } });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className={styles.timeSelectionContainer}>
        <h2 className={styles.timeSelectionTitle}>
          😊 בחרי ביום ובשעה הנוחה לך
        </h2>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            width: "100%",
            marginBottom: 2,
          }}
        >
          <DateCalendar
            date={selectedDate}
            onChange={handleDateChange}
            minDate={dayjs()}
            sx={{
              width: { xs: "100%", md: "50%" },
              borderRadius: "12px",
              boxShadow: { xs: "none", md: "0 4px 10px rgba(0, 0, 0, 0.1)" },
            }}
          />
          <Box
            sx={{
              width: { xs: "100%", md: "25%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {selectedDate && (
              <>
                <Typography variant="h6">זמני פגישה זמינים:</Typography>
                <HorizontalTimePicker
                  times={dailyAvailableTimes[
                    selectedDate.format("MMMM D, YYYY") || []
                  ].filter(
                    (time) =>
                      !occupiedTimes.includes(
                        `${selectedDate.format("MMMM D, YYYY")} at ${time}`
                      )
                  )}
                  selectedTime={selectedTime}
                  onTimeSelect={handleTimeSelect}
                />
              </>
            )}
            {errorMessage && (
              <Typography color="error" sx={{ marginBottom: 2 }}>
                {errorMessage}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            value={
              selectedDate && selectedTime
                ? `${selectedDate.format(
                    "MMMM D, YYYY"
                  )} at ${selectedTime.format("H:mm")}`
                : ""
            }
            variant="outlined"
            sx={{
              marginBottom: "20px",
              minWidth: "250px",
              marginRight: "10px",
            }}
            InputProps={{ readOnly: true }}
          />
          <IconButton
            variant="contained"
            onClick={handleConfirm}
            disabled={!selectedTime}
            sx={{ marginBottom: "20px" }}
          >
            <ArrowForwardIcon sx={{ color: "#007aff" }} />
          </IconButton>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default TimeSelection;
