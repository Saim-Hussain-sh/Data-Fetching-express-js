function Car(){
  const myfunc = () => {
    alert('Hello World');
  };
  return (
    <button onClick={myfunc}>Click me</button>
  );
}

// Style Attribute
function Car1(){
  const mystyles = {
    color: 'red',
    fontSize: '20px',
    backgroundColor: 'lightyellow',
  };
  return (
    <>
    
    <h1 style={mystyles}>My car</h1>
    <Car />
    </>
  )
}

export default Car1;
