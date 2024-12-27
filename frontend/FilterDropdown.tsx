import React, { useEffect, useState } from "react";
import { Button, Dropdown, Checkbox, Frame, Fieldset } from "@react95/core";

interface DropdownProps {
    onSelectionChange: (selectedOptions: string[]) => void;
    label: string;
    options: string[];
    currentSelections: string[];
  }

export default function FilterDropdown(props: DropdownProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(props.currentSelections);
  
  useEffect(() => {
    console.log("props.currentSelections updated", props.currentSelections);
    setSelectedOptions(props.currentSelections);
  }, [props.currentSelections]);

  const handleOptionChange = (option: string) => {
    let updatedOptions = [""]

    if (props.options.includes("Show All")){
      // if show all is selected, deselect everything else
      if (option == "Show All"){
        updatedOptions = ["Show All"]

      // if everything but show all is selected then select show all
      } else if (!selectedOptions.includes("Show All") && (selectedOptions.length == props.options.length - 1)) {
        updatedOptions = ["Show All"]

      } else {
          updatedOptions = selectedOptions.includes(option)
              ? selectedOptions.filter((item) => item !== option) // Remove if already selected
              : [...selectedOptions.filter((item) => item !== "Show All"), option]; // Add if not selected and remmove show all if selected
      }

      // if nothing selected then select show all
      if (updatedOptions.length == 0){
        updatedOptions = ["Show All"];
      }
    } else {
      updatedOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option) // Remove if already selected
        : [...selectedOptions, option]; // Add if not selected and remmove show all if selected
    }
    

    setSelectedOptions(updatedOptions);
    props.onSelectionChange(updatedOptions); // Notify parent about selection change

  };

  return (
    <div style={{ position: "relative" }}>
      <Fieldset legend={props.label} width="100%">
        <Frame display="flex" flexDirection="column">
          {props.options.map((option) => (
            <Checkbox checked={selectedOptions.includes(option)} onChange={() => handleOptionChange(option)}>
              {option}
           </Checkbox>
          ))}
        </Frame>
      </Fieldset>
    </div>
  );
};
