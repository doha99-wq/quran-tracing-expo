import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { SvgUri } from 'react-native-svg';

const PAGE =
  'https://raw.githubusercontent.com/quranpedia/quran-svg/main/mushafs/hafs/kfqc/svg/001.svg';

export default function App() {
  const [strokes, setStrokes] = useState([]);
  const [current, setCurrent] = useState([]);
  const [score, setScore] = useState(0);

  const addPoint = (e) => {
    const { locationX, locationY } = e.nativeEvent;
    setCurrent((p) => [...p, `${locationX},${locationY}`]);
  };

  const endStroke = () => {
    if (current.length > 1) setStrokes((s) => [...s, current]);
    setCurrent([]);
  };

  const evaluate = () => {
    const total = strokes.reduce((n, s) => n + s.length, 0);
    setScore(Math.min(100, Math.round((total / 180) * 100)));
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>سورة الفاتحة — نسخ بالقلم</Text>
      <View
        style={styles.page}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={addPoint}
        onResponderMove={addPoint}
        onResponderRelease={endStroke}
      >
        <View style={styles.bg} pointerEvents="none">
          <SvgUri width="100%" height="100%" uri={PAGE} />
        </View>
        <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
          {strokes.map((pts, i) => (
            <Polyline
              key={i}
              points={pts.join(' ')}
              fill="none"
              stroke="#1a4d8c"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {current.length > 1 && (
            <Polyline
              points={current.join(' ')}
              fill="none"
              stroke="#1a4d8c"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}
        </Svg>
      </View>
      <View style={styles.bar}>
        <Pressable style={styles.btn} onPress={evaluate}>
          <Text style={styles.btnText}>قيّم</Text>
        </Pressable>
        <Pressable
          style={styles.btn}
          onPress={() => {
            setStrokes([]);
            setCurrent([]);
            setScore(0);
          }}
        >
          <Text style={styles.btnText}>مسح</Text>
        </Pressable>
        <Text style={styles.score}>الدرجة: {score}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF8E1', paddingTop: 48 },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#3E2723',
  },
  page: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  bg: { ...StyleSheet.absoluteFillObject, opacity: 0.35 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
  },
  btn: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  score: { fontSize: 18, fontWeight: '700', color: '#3E2723' },
});
