import React, { useState, useEffect } from "react";
import axios from 'axios';

function App() {
  const [shift, setShift] = useState({ date: "", time: "", notifyTime: "" });
  const [shifts, setShifts] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const savedShifts = JSON.parse(localStorage.getItem('shifts')) || [];
    setShifts(savedShifts);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shift.date || !shift.time || !shift.notifyTime) {
      alert("日付、時間、通知時間を入力してください");
      return;
    }

    let newShifts;
    if (editIndex !== null) {
      newShifts = shifts.map((s, index) => (index === editIndex ? shift : s));
      setEditIndex(null);
    } else {
      newShifts = [...shifts, shift];
      sendEmailNotification(shift);
    }

    setShifts(newShifts);
    localStorage.setItem('shifts', JSON.stringify(newShifts));
    alert("シフトが保存されました");
    setShift({ date: "", time: "", notifyTime: "" });
  };

  const handleEdit = (index) => {
    setShift(shifts[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const newShifts = shifts.filter((_, i) => i !== index);
    setShifts(newShifts);
    localStorage.setItem('shifts', JSON.stringify(newShifts));
  };

  const sendEmailNotification = (shift) => {
    console.log('Sending email notification with shift details:', shift);
    axios.post('http://localhost:3002/send-email', shift)
      .then(response => {
        console.log('Email scheduled:', response.data);
      })
      .catch(error => {
        console.error('Error scheduling email:', error);
      });
  };

  return (
    <div>
      <h1>バイトのシフト登録</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={shift.date}
          onChange={(e) => setShift({ ...shift, date: e.target.value })}
        />
        <input
          type="time"
          value={shift.time}
          onChange={(e) => setShift({ ...shift, time: e.target.value })}
        />
        <input
          type="time"
          value={shift.notifyTime}
          onChange={(e) => setShift({ ...shift, notifyTime: e.target.value })}
          placeholder="通知時間"
        />
        <button type="submit">
          {editIndex !== null ? "更新" : "登録"}
        </button>
      </form>
      <h2>登録されたシフト</h2>
      <ul>
        {shifts.map((s, index) => (
          <li key={index}>
            {s.date} - {s.time} (通知: {s.notifyTime})
            <button onClick={() => handleEdit(index)}>編集</button>
            <button onClick={() => handleDelete(index)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
