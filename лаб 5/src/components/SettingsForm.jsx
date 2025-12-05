import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { difficultyPresets } from "../state/constants.js";

const schema = yup.object({
  difficulty: yup.string().oneOf(Object.keys(difficultyPresets)).required(),
  pairs: yup.number().min(4).max(18).required(),
  flipDelay: yup.number().min(300).max(1500).required(),
});

export const SettingsForm = ({ initialValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const handleDifficultyChange = (difficulty) => {
    const presetPairs = difficultyPresets[difficulty].pairs;
    setValue("difficulty", difficulty);
    setValue("pairs", presetPairs);
  };

  const wrappedSubmit = handleSubmit((values) => {
    onSubmit?.(values);
  });

  return (
    <form className="settings-form" onSubmit={wrappedSubmit}>
      <div className="form-row">
        <label>Рівень складності</label>
        <div className="difficulty-group">
          {Object.entries(difficultyPresets).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              className={`difficulty-option${watch("difficulty") === key ? " is-active" : ""}`}
              onClick={() => handleDifficultyChange(key)}
            >
              <strong>{preset.label}</strong>
              <p>{preset.pairs * 2} карток</p>
            </button>
          ))}
        </div>
        {errors.difficulty && <span className="error">{errors.difficulty.message}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="pairs">Кількість пар: {watch("pairs")}</label>
        <input type="range" id="pairs" min="4" max="18" step="1" {...register("pairs", { valueAsNumber: true })} />
        {errors.pairs && <span className="error">{errors.pairs.message}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="flipDelay">Швидкість приховування (мс): {watch("flipDelay")} </label>
        <input type="range" id="flipDelay" min="300" max="1500" step="50" {...register("flipDelay", { valueAsNumber: true })} />
        {errors.flipDelay && <span className="error">{errors.flipDelay.message}</span>}
      </div>

      <button className="btn-primary" type="submit" disabled={isSubmitting}>
        Зберегти та грати
      </button>
    </form>
  );
};


