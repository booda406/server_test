class CreateWorkers < ActiveRecord::Migration
  def change
    create_table :workers do |t|
      t.string :name
      t.integer :age

      t.timestamps
    end
  end
end
