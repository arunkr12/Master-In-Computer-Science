let mean lst =
  let sum = List.fold_left (fun acc x -> acc + x) 0 lst in
  float_of_int sum /. float_of_int (List.length lst)

let median lst =
  let sorted = List.sort compare lst in
  let len = List.length sorted in
  if len mod 2 = 0 then
    float_of_int (List.nth sorted (len/2 - 1) + List.nth sorted (len/2)) /. 2.0
  else
    float_of_int (List.nth sorted (len/2))

let mode lst =
  let counts = List.fold_left (fun acc x ->
    if List.mem_assoc x acc then
      (x, List.assoc x acc + 1) :: (List.remove_assoc x acc)
    else (x, 1) :: acc) [] lst in
  let max_freq = List.fold_left (fun m (_, f) -> max m f) 0 counts in
  List.filter (fun (_, f) -> f = max_freq) counts |> List.map fst

(* Output Logic *)
let () =
  let data = [12; 5; 8; 12; 5; 10; 15] in
  print_endline "--- OCaml Functional Statistics ---";
  Printf.printf "Input Data: ";
  List.iter (Printf.printf "%d ") data;
  Printf.printf "\nMean: %.2f\n" (mean data);
  Printf.printf "Median: %.2f\n" (median data);
  Printf.printf "Mode(s): ";
  List.iter (Printf.printf "%d ") (mode data);
  print_newline ()

