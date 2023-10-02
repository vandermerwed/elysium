import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';

interface Props {
  startDateTime: Date;
  unit?: dayjs.OpUnitType;
  decimalPlaces?: number;
  updateInterval?: number;
}

const calculateTimeSince = (startDateTime: Date, unit: dayjs.OpUnitType, decimalPlaces: number) => {
  const now = dayjs();
  const start = dayjs(startDateTime);
  const diff = now.diff(start, unit, true);
  return diff.toFixed(decimalPlaces);
};

const TimeSince: React.FC<Props> = ({
  startDateTime,
  unit = 'year',
  decimalPlaces = 9,
  updateInterval = 100,
}) => {
  const [timeSince, setTimeSince] = useState<string>('loading...');

  useEffect(() => {
    setTimeSince(calculateTimeSince(startDateTime, unit, decimalPlaces));

    const intervalId = setInterval(() => {
      setTimeSince(calculateTimeSince(startDateTime, unit, decimalPlaces));
    }, updateInterval);

    return () => clearInterval(intervalId);
  }, [startDateTime, unit, decimalPlaces, updateInterval]);

  return <span>{timeSince}</span>;
};

export default TimeSince;