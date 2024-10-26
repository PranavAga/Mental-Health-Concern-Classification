import { Chrono } from "react-chrono";

const Test = () => {
    const items = [{
        title: "May 1940",
        cardTitle: "Dunkirk",
        url: "http://www.history.com",
        cardSubtitle:"Men of the British Expeditionary Force (BEF) wade out to..",
        cardDetailedText: "Men of the British Expeditionary Force (BEF) wade out to..",
        },
    ];

    return (
      <div >
        <Chrono items={items} mode="VERTICAL" />
      </div>
    )
}

export default Test;