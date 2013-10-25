object @worker

attributes :name, :age

node :can_drink do |worker|
 worker.age >= 21
end
