class CreateImageProjects < ActiveRecord::Migration
  def change
    create_table :image_projects do |t|
      t.string :name
      t.string :framework
      t.string :image_url

      t.timestamps
    end
  end
end
